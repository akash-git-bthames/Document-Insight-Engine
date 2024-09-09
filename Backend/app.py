from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db, engine
from models import Base, Document
from schemas import DocumentUpload, DocumentResponse
from s3_utils import upload_to_s3
from unstructured.partition.pdf import partition_pdf
from elasticsearch import Elasticsearch
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import ElasticVectorSearch
from crewai import Agent
import shutil
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()


# Initialize Elasticsearch client
es_client = Elasticsearch(hosts=["http://localhost:9200"])

# Initialize LangChain embedding model and ElasticSearch vector store
embedding_model = OpenAIEmbeddings()
vector_store = ElasticVectorSearch(
    embedding_model.embed,
    es_client,
    index_name="document_vectors"
)

# Initialize CrewAI RAG model
rag_model = Agent(api_key="YOUR_CREWAI_API_KEY")


# 1. File Upload Route
@app.post("/upload/", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Step 1: Save the uploaded file temporarily
    file_location = f"temp_files/{file.filename}"
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Step 2: Upload the file to AWS S3
    s3_url = upload_to_s3(open(file_location, 'rb'), "your-bucket-name", file.filename)
    if not s3_url:
        raise HTTPException(status_code=500, detail="Failed to upload to S3")

    # Step 3: Parse the file content using unstructured.io
    parsed_content = ""
    if file.content_type == "application/pdf":
        document = partition_pdf(file_location)
        parsed_content = document.text

    # Step 4: Save document metadata to the database
    document_db = Document(
        filename=file.filename,
        file_type=file.content_type,
        s3_url=s3_url,
        parsed_content=parsed_content
    )
    db.add(document_db)
    db.commit()
    db.refresh(document_db)

    # Step 5: Index the parsed content in Elasticsearch
    document_data = {
        "filename": file.filename,
        "content": parsed_content,
        "metadata": {"author": "Unknown"},
        "timestamp": "2024-09-07T10:00:00"
    }
    index_document("documents", document_data)

    # Step 6: Index parsed content for NLP using LangChain
    index_document_for_nlp(document_data)

    # Step 7: Cleanup the temporary file
    os.remove(file_location)

    return DocumentResponse(
        id=document_db.id,
        filename=document_db.filename,
        file_type=document_db.file_type,
        s3_url=document_db.s3_url,
        parsed_content=document_db.parsed_content
    )


# 2. Elasticsearch: Index Document
def create_document_index(index_name: str = "documents"):
    if not es_client.indices.exists(index=index_name):
        es_client.indices.create(index=index_name, body={
            "mappings": {
                "properties": {
                    "filename": {"type": "text"},
                    "content": {"type": "text"},
                    "metadata": {"type": "object"},
                    "timestamp": {"type": "date"}
                }
            }
        })


def index_document(index_name: str, document: dict):
    es_client.index(index=index_name, body=document)


# 3. LangChain: NLP Indexing and Querying
def index_document_for_nlp(document: dict):
    content = document['content']
    vector_store.add_texts([content])


def get_rag_response(query: str):
    # Step 1: Search for relevant content from Elasticsearch using LangChain
    response = vector_store.search(query)

    # Step 2: Retrieve the most relevant document content
    most_relevant_content = response['hits'][0]['_source']['content']
    
    # Step 3: Generate a response using the RAG model
    generated_response = rag_model.generate(query, context=most_relevant_content)
    
    return generated_response


# 4. Query Route: RAG Agent Query Handling
@app.get("/query")
async def query_document(query: str):
    # Get the response using the RAG model
    response = get_rag_response(query)
    return {"query": query, "response": response}

@app.get("/")
async def homepage():
    return "hii"

# Create the Elasticsearch index for documents on startup
create_document_index()

