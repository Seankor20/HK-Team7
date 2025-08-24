import extract_all
import json
import question_type
import preprocess_llm
import os
import sys

# Use the current script directory as BASE_DIR for portability
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Accept PDF path as argument, fallback to default
if len(sys.argv) > 1:
    PDF_PATH = sys.argv[1]
else:
    PDF_PATH = os.path.join(BASE_DIR, "homework.pdf")

PROMPT_PATH = os.path.join(BASE_DIR, "prompt.txt")
EXTRACTED_DATA_PATH = os.path.join(BASE_DIR, "extracted_results", "extracted_results.json")
LLM_PREPROCESS_PATH = os.path.join(BASE_DIR, "llm_preprocess.json")
LLM_RESPONSE_PATH = os.path.join(BASE_DIR, "llm_response.json")
FINAL_OUTPUT_PATH = os.path.join(BASE_DIR, "final.json")

with open(f"{BASE_DIR}/deepseek_api_key", 'r') as file:
    api_key = file.read()

extract_all.main(pdf=PDF_PATH, output=f"{BASE_DIR}/extracted_results")
preprocess_llm.main(extracted_data_file=EXTRACTED_DATA_PATH, output_file=LLM_PREPROCESS_PATH)

with open(PROMPT_PATH, 'r') as file:
    prompt = file.read()

with open(LLM_PREPROCESS_PATH, 'r') as file:
    extraction_results = str(json.load(file))

prompt += extraction_results

# Please install OpenAI SDK first: `pip3 install openai`

from openai import OpenAI

print("Sending request to LLM...")

client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": prompt},
    ],
    stream=False
)

print("Response received from LLM.")

with open(LLM_RESPONSE_PATH, 'w', encoding='utf-8') as f:
    resp = json.loads(response.choices[0].message.content)
    json.dump(resp, f, ensure_ascii=False, indent=4)

question_type.main(LLM_RESPONSE_PATH, EXTRACTED_DATA_PATH, FINAL_OUTPUT_PATH)