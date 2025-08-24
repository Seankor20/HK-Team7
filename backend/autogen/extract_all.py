import os
import json
import argparse
import fitz  # PyMuPDF
from datetime import datetime

class PDFImageExtractor:
    def __init__(self, pdf_path, output_dir):
        self.pdf_path = pdf_path
        self.output_dir = output_dir
        self.extraction_results = []
    
    def get_image_coordinates(self, page, xref):
        """Extract image coordinates by searching through the page's content"""
        # Get the page's content as text dictionary
        content = page.get_text("dict")
        
        # Search for the image in blocks
        for block in content.get("blocks", []):
            if block.get("type") == 1:  # Image block
                if block.get("number") == xref:
                    bbox = block.get("bbox", [])
                    if bbox and len(bbox) == 4:
                        return bbox
        
        # If not found in blocks, try another approach
        try:
            # Get image rectangles
            image_rects = page.get_image_rects(xref)
            if image_rects:
                rect = image_rects[0]
                return [rect.x0, rect.y0, rect.x1, rect.y1]
        except:
            pass
        
        return None

    def extract_text_content(self, page):
        """Extract text content from the page with coordinates"""
        try:
            # Extract text as dictionary with detailed information
            text_dict = page.get_text("dict")
            
            text_blocks = []
            
            # Process each block of text
            for block in text_dict.get("blocks", []):
                if block.get("type") == 0:  # Text block
                    block_text = ""
                    block_lines = []
                    
                    # Process each line in the block
                    for line in block.get("lines", []):
                        line_text = ""
                        line_spans = []
                        
                        # Process each span in the line
                        for span in line.get("spans", []):
                            span_text = span.get("text", "").strip()
                            if span_text:
                                line_text += span_text + " "
                                
                                # Store span details with coordinates
                                span_details = {
                                    "text": span_text,
                                    "font": span.get("font", ""),
                                    "size": span.get("size", 0),
                                    "color": span.get("color", 0),
                                    "bbox": span.get("bbox", []),
                                    "origin": span.get("origin", [])
                                }
                                line_spans.append(span_details)
                        
                        if line_text.strip():
                            block_text += line_text + "\n"
                            
                            # Store line details
                            line_details = {
                                "text": line_text.strip(),
                                "bbox": line.get("bbox", []),
                                "spans": line_spans
                            }
                            block_lines.append(line_details)
                    
                    if block_text.strip():
                        # Store block details
                        block_details = {
                            "text": block_text.strip(),
                            "bbox": block.get("bbox", []),
                            "lines": block_lines
                        }
                        text_blocks.append(block_details)
            
            return text_blocks
            
        except Exception as e:
            print(f"Error extracting text: {str(e)}")
            return []

    def extract_images(self):
        """Main extraction method for both images and text"""
        try:
            # Create output directory if it doesn't exist
            if not os.path.exists(self.output_dir):
                os.makedirs(self.output_dir)
            
            print(f"Extracting content from: {self.pdf_path}")
            print(f"Output directory: {self.output_dir}")
            
            # Open the PDF file
            doc = fitz.open(self.pdf_path)
            results = []
            total_pages = len(doc)
            extracted_image_count = 0
            
            print(f"Total pages: {total_pages}")
            
            # Iterate through each page
            for page_num in range(total_pages):
                page = doc.load_page(page_num)
                
                # Extract text content from the page
                text_content = self.extract_text_content(page)
                
                # Get all images on the page
                image_list = page.get_images()
                
                page_images = []
                page_coordinates = []
                image_links = []
                
                # Process each image
                for img_index, img in enumerate(image_list):
                    xref = img[0]  # Get the XREF of the image
                    
                    # Extract image information
                    base_image = doc.extract_image(xref)
                    if base_image:
                        image_bytes = base_image["image"]
                        image_ext = base_image["ext"]
                        
                        # Get image coordinates (bounding box)
                        image_coords = self.get_image_coordinates(page, xref)
                        
                        # Generate filename and save image
                        image_filename = f"page_{page_num+1}_img_{img_index+1}.{image_ext}"
                        image_path = os.path.join(self.output_dir, image_filename)
                        
                        with open(image_path, "wb") as img_file:
                            img_file.write(image_bytes)
                        
                        image_links.append(image_path)
                        extracted_image_count += 1
                        
                        # Prepare image data
                        image_data = {
                            "filename": image_filename,
                            "path": image_path,
                            "format": image_ext,
                            "size": len(image_bytes),
                            "coordinates": image_coords,
                            "xref": xref
                        }
                        
                        page_images.append(image_data)
                        page_coordinates.append(image_coords)
                
                # Add page results to the main list
                page_result = {
                    "page": page_num + 1,
                    "text_content": text_content,
                    "images": page_images,
                    "coordinates": page_coordinates,
                    "image_links": image_links
                }
                results.append(page_result)
                
                # Show progress
                progress = int((page_num + 1) / total_pages * 100)
                print(f"Processing page {page_num + 1}/{total_pages} ({progress}%) - "
                      f"{len(page_images)} images, {len(text_content)} text blocks")
            
            doc.close()
            self.extraction_results = results
            
            # Generate JSON output
            json_path = self.generate_json_output()
            
            # Generate text output
            text_path = self.generate_text_output()
            
            print(f"\nExtraction complete!")
            print(f"Total images extracted: {extracted_image_count}")
            print(f"JSON results saved to: {json_path}")
            print(f"Text content saved to: {text_path}")
            
            return results
            
        except Exception as e:
            print(f"Error during extraction: {str(e)}")
            raise

    def generate_text_output(self):
        """Generate a readable text output file"""
        text_path = os.path.join(self.output_dir, "extracted_text.txt")
        
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(f"PDF Text Extraction Results\n")
            f.write(f"PDF File: {self.pdf_path}\n")
            f.write(f"Extraction Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("=" * 60 + "\n\n")
            
            for page_data in self.extraction_results:
                f.write(f"\n=== PAGE {page_data['page']} ===\n")
                
                # Write text content
                if page_data['text_content']:
                    f.write("\nTEXT CONTENT:\n")
                    for i, block in enumerate(page_data['text_content']):
                        f.write(f"\nBlock {i + 1}:\n")
                        f.write(f"{block['text']}\n")
                        f.write(f"Coordinates: {block['bbox']}\n")
                
                # Write image info
                if page_data['images']:
                    f.write(f"\nIMAGES ({len(page_data['images'])}):\n")
                    for img in page_data['images']:
                        f.write(f"- {img['filename']} ({img['format']}, {img['size']} bytes)\n")
                        f.write(f"  Coordinates: {img['coordinates']}\n")
                
                f.write("\n" + "-" * 40 + "\n")
        
        return text_path

    def generate_json_output(self):
        """Generate JSON output file with both text and image data"""
        # Create a comprehensive JSON output
        json_output = []
        for page_data in self.extraction_results:
            # Extract image information
            image_info = []
            for img in page_data["images"]:
                image_info.append({
                    "filename": img["filename"],
                    "path": img["path"],
                    "format": img["format"],
                    "size": img["size"],
                    "coordinates": img["coordinates"]
                })
            
            # Extract text information
            text_info = []
            for block in page_data["text_content"]:
                text_info.append({
                    "text": block["text"],
                    "coordinates": block["bbox"],
                    "line_count": len(block.get("lines", []))
                })
            
            json_output.append({
                "page": page_data["page"],
                "images": image_info,
                "text_blocks": text_info,
                "total_images": len(image_info),
                "total_text_blocks": len(text_info)
            })
        
        # Save JSON to file
        json_path = os.path.join(self.output_dir, "extracted_results.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(json_output, f, indent=2, ensure_ascii=False)
        
        return json_path

def main(pdf, output):
    
    # Validate PDF file exists
    if not os.path.exists(pdf):
        print(f"Error: PDF file '{pdf}' does not exist.")
        return 1
    
    # Validate PDF file extension
    if not pdf.lower().endswith('.pdf'):
        print(f"Warning: File '{pdf}' does not have a .pdf extension.")
    
    try:
        # Create extractor instance and process PDF
        extractor = PDFImageExtractor(pdf, output)
        results = extractor.extract_images()
        
        # Print summary
        print("\n=== EXTRACTION SUMMARY ===")
        total_images = 0
        total_text_blocks = 0
        
        for page_data in results:
            images_count = len(page_data['images'])
            text_blocks_count = len(page_data['text_content'])
            total_images += images_count
            total_text_blocks += text_blocks_count
            
            print(f"Page {page_data['page']}: {images_count} images, {text_blocks_count} text blocks")
        
        print(f"\nTOTAL: {total_images} images, {total_text_blocks} text blocks extracted")
            
        return 0
        
    except Exception as e:
        print(f"Extraction failed: {str(e)}")
        return 1

if __name__ == "__main__":
    exit(main())