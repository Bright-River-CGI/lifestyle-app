import React, { useState } from 'react';
import { X } from 'lucide-react';
import { OrderFile, Comment } from '../types/file';

interface FileViewerProps {
  file: OrderFile;
  onClose: () => void;
}

export default function FileViewer({ file, onClose }: FileViewerProps) {
  const [comments, setComments] = useState<Comment[]>(file.comments || []);
  const [newComment, setNewComment] = useState('');

  const isImage = file.type.startsWith('image/');

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    const comment: Comment = {
      id: Date.now(),
      text: newComment,
      author: 'Client', // Replace with actual client name if available
      date: new Date().toISOString(),
    };

    // Update comments state
    setComments([...comments, comment]);
    // Clear the input
    setNewComment('');
  };

  const handleApprove = () => {
    // Implement approve functionality
    alert('File approved!');
  };

  const handleReject = () => {
    // Implement reject functionality
    alert('File rejected!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden flex">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 h-full">
          {isImage ? (
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              src={file.url}
              title={file.name}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Comments Sidebar */}
        <div className="w-80 h-full border-l border-gray-200 p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Comments</h2>
          <div className="flex-1 overflow-y-auto mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="mb-2">
                <p className="text-sm">{comment.text}</p>
                <p className="text-xs text-gray-500">
                  {comment.author} -{' '}
                  {new Date(comment.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full h-20 p-2 border rounded mb-2"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleAddComment}
              className="w-full bg-blue-500 text-white py-2 rounded mb-2"
            >
              Add Comment
            </button>
            <button
              onClick={handleApprove}
              className="w-full bg-green-500 text-white py-2 rounded mb-2"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="w-full bg-red-500 text-white py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}