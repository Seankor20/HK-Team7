import json

QUESTION_TYPE = ["read alphabets/words", "read images", "phonetic awareness", "read sentences"]
CONTAIN_IMAGE = {
    "read alphabets/words": False,
    "read images": True,
    "phonetic awareness": False,
    "read sentences": False
}
THRESHOLD = 50  # Threshold for determining if text is associated with an image

def find_text_image_pairs(page: int, extracted_data: json, llm_response_file: json): 
    
    with open(extracted_data, 'r') as file:
        text_data = json.load(file)
        file.close()
    
    with open(llm_response_file, 'r') as file:
        llm_response = json.load(file)
        file.close()
    llm_content = None
    for item in llm_response:
        if item['page'] == page:
            llm_content = item["content"]
            break
    
    right_ans = [item['right_ans'] for item in llm_content]

    pairs = []

    for item in text_data:
        if item['page'] == page:
            text_blocks = item['text_blocks']
            image_links = [img['path'] for img in item['images']]
            image_coordinates = [img['coordinates'] for img in item['images']]

            for text_block in text_blocks:
                text = text_block['text']

                if text not in right_ans and \
                    (text[:-1]) not in right_ans:
                    continue
                
                for item in llm_content:
                    if text == item['right_ans'] or \
                        (text[:-1] == item['right_ans']):
                        wrong_ans = item['wrong_ans']
                        break

                text_coordinate = text_block['coordinates']
                
                for image_link, image_coord in zip(image_links, image_coordinates):
                    if image_coord[0] <= text_coordinate[0] <= image_coord[2] and \
                       image_coord[0] <= text_coordinate[2] <= image_coord[2] and \
                        image_coord[3] < text_coordinate[1] and \
                        text_coordinate[1] - image_coord[3] < THRESHOLD:
                        pairs.append({
                            'right_ans': text,
                            'wrong_ans': wrong_ans, 
                            'image_link': image_link,
                        })
            pass
    return pairs

def get_texts(page_num: int, extracted_data: json, llm_response_file: json):
    with open(extracted_data, 'r') as file:
        text_data = json.load(file)
    
    with open(llm_response_file, 'r') as file:
        llm_response = json.load(file)
        file.close()

    for item in llm_response:
        if item['page'] == page_num:
            llm_content = item["content"]
            break

    texts = []
    for item in text_data:
        if item['page'] == page_num:
            if 'text_blocks' not in item:
                continue
            # print(llm_content)
            for text_block in item['text_blocks']:
                # print(text_block['text'][:-1])
                if text_block['text'] in llm_content or \
                    (text_block['text'][:-1]) in llm_content:
                    texts.append(text_block['text'])
    return texts


def main(llm_response_file, extracted_data_file, final_output_file):
    with open(llm_response_file, 'r') as file:
        llm_response = json.load(file)
        file.close()

    with open(final_output_file, 'w') as file:
        output_data = []
        for page in llm_response:
            page_num = page["page"]
            question_type = page["question_type"]
            if question_type not in QUESTION_TYPE:
                pass
            else:
                if CONTAIN_IMAGE[question_type]:
                    pairs = find_text_image_pairs(page_num, extracted_data=extracted_data_file, llm_response_file=llm_response_file)
                    question_dict = {
                        "page": page_num,
                        "question_type": question_type,
                        "text_image_pairs": pairs
                    }
                    output_data.append(question_dict)

                else:
                    texts = get_texts(page_num=page_num, extracted_data=extracted_data_file, llm_response_file=llm_response_file)
                    question_dict = {
                        "page": page_num,
                        "question_type": question_type,
                        "texts": texts
                    }
                    output_data.append(question_dict)
        json.dump(output_data, file, ensure_ascii=False, indent=4)
        print("Final output saved to final_file.json")