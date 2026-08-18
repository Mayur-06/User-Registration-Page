import React, { useState } from 'react';
import { X, Upload, Plus, Database, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const AddContextModal = ({
  isOpen,
  onClose,
  onAddFile,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  if (!isOpen) return null;

  const sampleDatasets = [
    {
      id: `sample-${Date.now()}-1`,
      name: 'AlphaScale_Series_B_TermSheet.pdf',
      size: '3.1 MB',
      pages: 18,
      type: 'pdf',
      icon: 'picture_as_pdf',
      color: '#ffb4ab',
      summary: 'Series B valuation terms, 1x non-participating liquidation preference, protective provisions, and pro-rata rights.',
      content: 'Series B Term Sheet: Pre-money valuation $85M. 1x Non-participating liquidation preference with standard 20% option pool expansion.',
    },
    {
      id: `sample-${Date.now()}-2`,
      name: 'System_Microservices_Architecture.png',
      size: '1.4 MB',
      type: 'image',
      icon: 'bar_chart',
      color: '#818cf8',
      summary: 'Kubernetes cluster topology, gRPC ingress, Redis cache layer, and Postgres primary-replica failover diagram.',
    },
    {
      id: `sample-${Date.now()}-3`,
      name: 'customer_retention_cohorts_2026.csv',
      size: '2.8 MB',
      type: 'sheet',
      icon: 'table_chart',
      color: '#2fd9f4',
      summary: 'Monthly cohort churn matrix, Net Dollar Retention (NDR), and Customer Acquisition Cost (CAC) payback curves.',
    },
  ];

  const processFileUpload = async (file) => {
    if (!file) return;
    setUploadError(null);
    setUploadSuccess(null);
    setIsUploading(true);

    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    try {
      // Send directly to backend RAG ingestion pipeline
      const res = await api.documents.upload(file);

      const newFile = {
        id: `uploaded-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: isPdf ? (res.chunks ? Math.ceil(res.chunks / 3) : 1) : undefined,
        type: isPdf ? 'pdf' : isImage ? 'image' : 'text',
        icon: isPdf ? 'picture_as_pdf' : 'description',
        color: isPdf ? '#ffb4ab' : '#818cf8',
        summary: `Indexed into FAISS (${res.chunks || 1} text chunks generated).`,
      };

      setUploadSuccess(`"${file.name}" indexed successfully (${res.chunks || 0} chunks).`);
      if (onAddFile) {
        onAddFile(newFile);
      }
      setTimeout(() => {
        setIsUploading(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Document upload error:', err);
      // If upload failed (for instance if token not provided, or backend issue), still allow local preview if desired
      setUploadError(err.message || 'Failed to index document into backend vector database.');
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFileUpload(files[0]);
    }
  };

  const handleSelectSample = (sample) => {
    if (onAddFile) {
      onAddFile(sample);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#08101d] border border-[#1e293b] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#070f1d] px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-[#f4f4f5]" style={{ fontFamily: 'Sora, sans-serif' }}>
              Add Context to RAG Pipeline
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f4f4f5] hover:bg-[#0e1928] border border-transparent hover:border-[#1e293b] transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-[#050b14]">
          {/* Status Banners */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`flex flex-col items-center justify-center p-7 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              isUploading
                ? 'border-[#38bdf8] bg-[#38bdf8]/5 cursor-wait'
                : dragOver
                ? 'border-[#38bdf8] bg-[#38bdf8]/10'
                : 'border-[#1e293b] hover:border-[#38bdf8]/60 hover:bg-[#08101d]'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-8 h-8 text-[#38bdf8] animate-spin" />
                <p className="font-mono text-xs text-[#38bdf8] font-semibold">
                  Extracting text, generating embeddings & indexing in FAISS...
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-7 h-7 text-[#38bdf8] mb-2.5 animate-bounce" />
                <p className="font-mono text-xs sm:text-sm text-[#f4f4f5] font-semibold">
                  Drop PDF or context documents here
                </p>
                <p className="text-[11px] text-[#94a3b8] mt-1 font-mono">
                  or click to upload and index into your backend RAG database
                </p>
              </>
            )}
            <input
              type="file"
              disabled={isUploading}
              onChange={handleFileInputChange}
              accept=".pdf,.txt,.docx,.csv"
              className="hidden"
            />
          </label>

          {/* Sample Datasets */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-wider font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>Or choose from curated context sets:</span>
            </div>

            <div className="space-y-2">
              {sampleDatasets.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => !isUploading && handleSelectSample(sample)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#08101d] border border-[#1e293b] hover:border-[#38bdf8]/60 hover:bg-[#0e1928] cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] shrink-0 border border-current/20"
                      style={{ backgroundColor: `${sample.color}15`, color: sample.color }}
                    >
                      {sample.type === 'pdf' ? 'PDF' : sample.type === 'image' ? 'IMG' : 'CSV'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#f4f4f5] group-hover:text-[#38bdf8] transition-colors truncate">
                        {sample.name}
                      </p>
                      <p className="text-[11px] text-[#94a3b8] truncate max-w-sm font-sans">
                        {sample.summary}
                      </p>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-[#38bdf8] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#070f1d] px-6 py-3.5 border-t border-[#1e293b] flex justify-end">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-1.5 rounded-lg text-xs font-mono text-[#94a3b8] hover:text-[#f4f4f5] hover:bg-[#0e1928] border border-transparent hover:border-[#1e293b] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContextModal;
