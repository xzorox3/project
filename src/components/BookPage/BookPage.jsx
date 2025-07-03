import React, { useState, useRef } from 'react';
import ButtonAction from '../ButtonAction/ButtonAction ';
import { useParams } from 'react-router-dom';

const BookPage = () => {
  const { deptName } = useParams();
  const [books, setBooks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const uploadInputRef = useRef(null);
  const updateInputRef = useRef(null);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    setBooks((prev) => prev.filter((book) => !selectedIds.includes(book.id)));
    setSelectedIds([]);
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newBooks = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name,
      file,
    }));
    setBooks((prev) => [...prev, ...newBooks]);
  };

  const handleUpdate = (e) => {
    const file = e.target.files[0];
    if (!file || selectedIds.length === 0) return;
    setBooks((prev) =>
      prev.map((book) =>
        selectedIds.includes(book.id) ? { ...book, title: file.name, file } : book
      )
    );
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
        Books for {decodeURIComponent(deptName)}
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {books.map((book) => (
          <div key={book.id} className="relative flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <input
              type="checkbox"
              className="absolute top-3 left-3 w-5 h-5"
              checked={selectedIds.includes(book.id)}
              onChange={() => toggleSelect(book.id)}
            />
            
            <div className="p-4 flex flex-col items-center w-full">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl w-16 h-16 flex items-center justify-center mb-3">
                <span className="text-black dark:text-white font-bold">BK</span>
              </div>
              
              <div className="w-full">
                <span className="text-black dark:text-white font-medium text-center text-sm truncate block w-full px-2">
                  {book.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <input
        type="file"
        multiple
        ref={uploadInputRef}
        accept="application/pdf,image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <input
        type="file"
        ref={updateInputRef}
        accept="application/pdf,image/*"
        className="hidden"
        onChange={handleUpdate}
      />

      <div className="mt-10 w-full max-w-6xl">
        <ButtonAction
          onDelete={handleDelete}
          onUploadClick={() => uploadInputRef.current.click()}
          onUpdateClick={() => updateInputRef.current.click()}
          disableUpdate={books.length === 0}
          disableDelete={selectedIds.length === 0}
        />
      </div>
    </div>
  );
};

export default BookPage;