import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
  height = 300,
  disabled = false,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className={cn('w-full', className)}>
      <Editor
        apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc" // Free TinyMCE API key
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image emoticons | help',
          content_style: `
            body { 
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; 
              font-size: 14px;
              line-height: 1.6;
            }
          `,
          placeholder,
          branding: false,
          resize: false,
          statusbar: false,
          image_advtab: true,
          image_uploadtab: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          images_upload_handler: async (blobInfo) => {
            // Handle image upload - you can implement your own logic here
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };
              reader.onerror = () => reject('Failed to read file');
              reader.readAsDataURL(blobInfo.blob());
            });
          },
          skin: 'oxide',
          content_css: 'default',
        }}
      />
    </div>
  );
};