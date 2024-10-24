import React, { useState } from 'react';
import { File, Download, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { OrderFile } from '../types/file';
import FileViewer from './FileViewer';
import RoleGuard from './RoleGuard';

interface FileCardProps {
  file: OrderFile;
  onDownload: (file: OrderFile) => void;
  onDelete: (fileId: string) => void;
  onApprove: (fileId: string) => void;
  onReject: (fileId: string) => void;
  isEmployee: boolean;
}

export default function FileCard({ 
  file, 
  onDownload, 
  onDelete, 
  onApprove, 
  onReject,
  isEmployee 
}: FileCardProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => setIsViewerOpen(true)}
        >
          <File className="h-8 w-8 text-gray-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
            <p className="text-xs text-gray-500">
              {new Date(file.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <RoleGuard allowedRoles={['employee']}>
            {file.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove(file.id)}
                  className="p-1 text-green-600 hover:text-green-700"
                  title="Approve"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onReject(file.id)}
                  className="p-1 text-red-600 hover:text-red-700"
                  title="Reject"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </>
            )}
          </RoleGuard>
          
          <button
            onClick={() => onDownload(file)}
            className="p-1 text-gray-400 hover:text-gray-500"
            title="Download"
          >
            <Download className="h-5 w-5" />
          </button>
          
          <RoleGuard allowedRoles={['employee']}>
            <button
              onClick={() => onDelete(file.id)}
              className="p-1 text-gray-400 hover:text-red-500"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </RoleGuard>
        </div>
      </div>

      {isViewerOpen && (
        <FileViewer
          file={file}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </>
  );
}