import React, { useState, useEffect } from 'react';
import { Plus, Library, BookOpen, Search, CheckCircle2, Bookmark } from 'lucide-react';
import { bookService, studentService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { useToast } from '../hooks/useToast';

export const LibraryPage = () => {
  const { addToast } = useToast();
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    isbn: '978-0123456789',
    category: 'Mathematics',
    copies: 15,
    available: 15,
    location: 'Shelf A-01',
  });

  const [issueFormData, setIssueFormData] = useState({
    studentId: '',
    dueDate: '2025-09-25',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bData, sData] = await Promise.all([bookService.getAll(), studentService.getAll()]);
      setBooks(bData);
      setStudents(sData);
      if (sData.length) setIssueFormData((prev) => ({ ...prev, studentId: sData[0].id }));
    } catch (err) {
      addToast('Failed to load library catalog', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await bookService.create(bookFormData);
      addToast('Book added to library catalog', 'success');
      setIsBookModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Failed to add book', 'error');
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      if (selectedBook.available <= 0) {
        addToast('No copies available!', 'error');
        return;
      }
      await bookService.update(selectedBook.id, {
        available: selectedBook.available - 1,
      });
      addToast(`Book "${selectedBook.title}" issued successfully!`, 'success');
      setIsIssueModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Failed to issue book', 'error');
    }
  };

  const columns = [
    { header: 'Book Title', key: 'title', render: (row) => <div><p className="font-bold text-slate-900 dark:text-slate-100">{row.title}</p><span className="text-[10px] text-slate-400">ISBN: {row.isbn}</span></div> },
    { header: 'Author', key: 'author' },
    { header: 'Category', key: 'category', render: (row) => <Badge variant="primary">{row.category}</Badge> },
    { header: 'Shelf Location', key: 'location' },
    { header: 'Availability', key: 'available', render: (row) => <span className="font-bold text-emerald-600">{row.available} / {row.copies} Copies</span> },
    {
      header: 'Action',
      key: 'action',
      render: (row) => (
        <Button size="sm" variant="secondary" icon={Bookmark} disabled={row.available <= 0} onClick={() => { setSelectedBook(row); setIsIssueModalOpen(true); }}>
          Issue Book
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Library Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Book repository, ISBN search, stock availability, issue & return logs</p>
        </div>
        <Button icon={Plus} onClick={() => setIsBookModalOpen(true)}>
          Add New Book
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <Input icon={Search} placeholder="Search books by title, author, category, or ISBN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <Table columns={columns} data={books.filter((b) => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase()))} isLoading={isLoading} />

      {/* Add Book Modal */}
      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="Add Book to Catalog">
        <form onSubmit={handleAddBook} className="space-y-4">
          <Input label="Book Title" required value={bookFormData.title} onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })} />
          <Input label="Author" required value={bookFormData.author} onChange={(e) => setBookFormData({ ...bookFormData, author: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="ISBN" required value={bookFormData.isbn} onChange={(e) => setBookFormData({ ...bookFormData, isbn: e.target.value })} />
            <Select label="Category" options={['Mathematics', 'Physics', 'Biology', 'History', 'Literature']} value={bookFormData.category} onChange={(e) => setBookFormData({ ...bookFormData, category: e.target.value })} />
            <Input label="Total Copies" type="number" required value={bookFormData.copies} onChange={(e) => setBookFormData({ ...bookFormData, copies: parseInt(e.target.value) || 1, available: parseInt(e.target.value) || 1 })} />
            <Input label="Shelf Location" value={bookFormData.location} onChange={(e) => setBookFormData({ ...bookFormData, location: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Book</Button>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      {selectedBook && (
        <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Issue Book to Student">
          <form onSubmit={handleIssueBook} className="space-y-4">
            <p className="text-xs text-slate-500">Issuing: <strong className="text-slate-900 dark:text-slate-100">{selectedBook.title}</strong></p>
            <Select label="Borrowing Student" options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` }))} value={issueFormData.studentId} onChange={(e) => setIssueFormData({ ...issueFormData, studentId: e.target.value })} />
            <Input label="Return Due Date" type="date" required value={issueFormData.dueDate} onChange={(e) => setIssueFormData({ ...issueFormData, dueDate: e.target.value })} />
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
              <Button type="submit">Issue Book</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
