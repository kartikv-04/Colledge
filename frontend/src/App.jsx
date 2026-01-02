import { useState, useEffect } from 'react'
import Contact from './components/Contact'

function App() {
  const [contacts, setContacts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Delete state
  const [deleteId, setDeleteId] = useState(null)

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/view-contact')
      if (!response.ok) throw new Error('Failed to fetch contacts')
      const data = await response.json()
      setContacts(data.contact || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleSuccess = () => {
    setIsModalOpen(false)
    fetchContacts()
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-contact/${deleteId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');

      // Optimistic update or refetch
      setContacts(contacts.filter(c => c._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("Failed to delete contact");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Contact Manager</h1>

          {contacts.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Contact
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center pt-20">
            <div className="text-gray-500">Loading contacts...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <button onClick={fetchContacts} className="underline ml-2">Retry</button>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500 mb-6">Get started by creating a new contact.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Create Contact
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:border-blue-300 transition-colors relative group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-xs text-gray-500">Contact ID: {contact._id.slice(-4)}</p>
                  </div>
                </div>

                <button
                  onClick={() => setDeleteId(contact._id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Contact"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>

                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-gray-500 w-12">Email:</span>
                    <span className="truncate">{contact.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-gray-500 w-12">Phone:</span>
                    {contact.phone}
                  </p>
                  {contact.message && (
                    <p className="mt-3 pt-3 border-t border-gray-100 text-gray-500 italic">
                      "{contact.message}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Modal */}
      {isModalOpen && (
        <Contact
          onCancel={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Contact?</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this contact? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
