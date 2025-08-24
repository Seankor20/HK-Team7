import json
def main(extracted_data_file, output_file):
    with open("/Users/xuelisun/Desktop/MS_Teckathon/extracted_results/extraction_results.json", 'r') as file:
        extraction_results = json.load(file)

    result = []
    for item in extraction_results:
        page_num = item['page']
        if 'text_blocks' not in item:
            continue
    
        text_blocks = []

        for block in item['text_blocks']:
            text_blocks.append(block['text'])

        result.append({
            'page': page_num,
            'text_blocks': text_blocks
        })

    json.dump(result, open("/Users/xuelisun/Desktop/MS_Teckathon/llm_preprocess.json", 'w', encoding='utf-8'), ensure_ascii=False, indent=4)
    print("File save to llm_preprocess.json")