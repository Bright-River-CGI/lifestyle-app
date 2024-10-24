import React from 'react';
import { useParams } from 'react-router-dom';
import { useOrderStore } from '../../stores/orderStore';
import { useAuthStore } from '../../stores/authStore';
import FileUploader from '../../components/FileUploader';
import FileCard from '../../components/FileCard';
import EmptyState from '../../components/EmptyState';
import RoleGuard from '../../components/RoleGuard';
import { OrderFile } from '../../types/file';

export default function OrderFiles() {
  const { id } = useParams<{ id: string }>();
  const order = useOrderStore((state) => state.orders.find(o => o.id === id));
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const user = useAuthStore((state) => state.user);

  if (!order || !id) {
    return (
      <EmptyState
        title="Order not found"
        description="The requested order could not be found"
      />
    );
  }

  const files = order.files || [];

  const handleFileSelect = (fileList: FileList) => {
    const newFiles: OrderFile[] = Array.from(fileList).map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      url: URL.createObjectURL(file)
    }));

    updateOrder(id, {
      files: [...files, ...newFiles]
    });
  };

  const handleDownload = (file: OrderFile) => {
    window.open(file.url, '_blank');
  };

  const handleDelete = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    updateOrder(id, { files: updatedFiles });
  };

  const handleStatusChange = (fileId: string, status: OrderFile['status']) => {
    const updatedFiles = files.map(f =>
      f.id === fileId ? { ...f, status } : f
    );
    updateOrder(id, { files: updatedFiles });
  };

  return (
    <div className="space-y-6">
      <RoleGuard allowedRoles={['employee']}>
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h2>
          <FileUploader
            onFileSelect={handleFileSelect}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          />
        </div>
      </RoleGuard>

      {files.length > 0 ? (
        <div className="grid gap-4">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onApprove={(id) => handleStatusChange(id, 'approved')}
              onReject={(id) => handleStatusChange(id, 'rejected')}
              isEmployee={user?.role === 'employee'}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No files uploaded"
          description={
            user?.role === 'employee'
              ? "Upload files for this order by dragging and dropping them or clicking the upload area above"
              : "No files have been uploaded for this order yet"
          }
        />
      )}
    </div>
  );
}