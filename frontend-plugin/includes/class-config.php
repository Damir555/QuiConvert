<?php
if (!defined('ABSPATH')) exit;

class QuiConvert_Config_512 {
    public static function api_base() {
        return 'https://quiconvert-backend.onrender.com/api/pdf';
    }

    public static function api_key() {
        return 'REPLACE_WITH_YOUR_API_KEY';
    }

    public static function max_upload_mb() {
        return 5;
    }

    public static function tools() {
        return array(
            'merge' => array(
                'id' => 'merge',
                'title' => 'Merge PDF files',
                'subtitle' => 'Upload two or more PDF files and combine them into one document.',
                'button' => 'Merge PDFs',
                'endpoint' => 'merge',
                'multiple' => true,
                'minFiles' => 2,
                'maxFiles' => 20,
                'accepts' => array('pdf'),
                'output' => 'pdf',
                'options' => array()
            ),
            'split' => array(
                'id' => 'split',
                'title' => 'Split PDF file',
                'subtitle' => 'Upload one PDF and split it by page ranges or into separate pages.',
                'button' => 'Split PDF',
                'endpoint' => 'split',
                'multiple' => false,
                'minFiles' => 1,
                'maxFiles' => 1,
                'accepts' => array('pdf'),
                'output' => 'pdf_or_zip',
                'options' => array('split_pages')
            ),
            'compress' => array(
                'id' => 'compress',
                'title' => 'Compress PDF file',
                'subtitle' => 'Upload one PDF and reduce its file size.',
                'button' => 'Compress PDF',
                'endpoint' => 'compress',
                'multiple' => false,
                'minFiles' => 1,
                'maxFiles' => 1,
                'accepts' => array('pdf'),
                'output' => 'pdf',
                'options' => array()
            )
        );
    }

    public static function strings() {
        return array(
            'idle' => 'Drop PDF files here',
            'filesSelected' => 'file(s) selected',
            'processing' => 'Processing...',
            'download' => 'Download file',
            'noFiles' => 'Please add at least one PDF file.',
            'pdfOnly' => 'Only PDF files are accepted.',
            'fileTooLarge' => 'File is too large. Free limit is 5 MB.',
            'genericError' => 'An error occurred while processing your file.',
            'mergeNeedTwo' => 'Please upload at least two PDF files for merge.',
            'singleFileOnly' => 'Please upload only one PDF file for this tool.',
            'tooManyFiles' => 'Too many files selected for this tool.',
            'completed' => 'Processing completed. Your file is ready for download.',
            'busy' => 'Processing is already in progress. Please wait.'
        );
    }
}
