This directory is used to extract information from PDF question form.

#### Dependencies:
`pip install openai PyMuPDF`

#### Usage:
1. Go to `main.py`, replace `BASE_DIR` with your own path.
2. Run `python main.py`
3. The result file `final.json` will be generated in the `autogen` directory.

#### Tips:
1. `autogen/sample_outputs/extracted_results/final.json` shows the API structure.
2. Do not share `deepseek_api_key` with others. And remember to remove `deepseek_api_key` before submission to bemyapp, as no API keys should be submitted according to the guidelines.