import DOMPurify from "dompurify";

export function  trimContent(content, maxChars = 100) {
    if (content.length <= maxChars) {
      return content;
    } else {
      return content.substring(0, maxChars) + "...";
    }
  }

  export function cleanHTML (content) {
    return DOMPurify.sanitize(content); 
  };