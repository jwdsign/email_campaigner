import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import './App.css';

function App() {
  const [addresses, setAddresses] = useState({ contacts: [], salutations: [] });
  const [templateData, setTemplateData] = useState({ template: '' });
  const [formData, setFormData] = useState({
    userFirstname: '',
    userLastname: '',
    userEmail: '',
    recipientIndex: '',
    template: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/addresses.json')
      .then(response => response.json())
      .then(data => setAddresses(data))
      .catch(error => console.error('Error fetching addresses:', error));

    fetch('/template.json')
      .then(response => response.json())
      .then(data => {
        setTemplateData(data);
        setFormData(prev => ({ ...prev, template: data.template }));
      })
      .catch(error => console.error('Error fetching template:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateChange = (content) => {
    setFormData(prev => ({ ...prev, template: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const recipient = addresses.contacts[formData.recipientIndex];
    const emailBody = formData.template
      .replace('$salutation', recipient.salutation)
      .replace('$firstname', formData.userFirstname)
      .replace('$lastname', recipient.lastname);

    try {
      const response = await fetch('/send-email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userFirstname: formData.userFirstname,
          userLastname: formData.userLastname,
          userEmail: formData.userEmail,
          recipientEmail: recipient.email,
          template: emailBody,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus(result.message);
      } else {
        setStatus(result.error);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('Failed to send email');
    }
  };

  return (
    <div className="App">
      <h2>Email Generator</h2>
      <form onSubmit={handleSubmit}>
        <label>Your First Name:</label>
        <input
          type="text"
          name="userFirstname"
          value={formData.userFirstname}
          onChange={handleChange}
          required
        />

        <label>Your Last Name:</label>
        <input
          type="text"
          name="userLastname"
          value={formData.userLastname}
          onChange={handleChange}
          required
        />

        <label>Your Email:</label>
        <input
          type="email"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
          required
        />

        <label>Select Recipient:</label>
        <select
          name="recipientIndex"
          value={formData.recipientIndex}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a recipient --</option>
          {addresses.contacts.map((contact, index) => (
            <option key={index} value={index}>
              {`${contact.salutation} ${contact.firstname} ${contact.lastname} (${contact.email})`}
            </option>
          ))}
        </select>

        <label>Email Template:</label>
        <Editor value={formData.template} onChange={handleTemplateChange} />

        <button type="submit">Send Email</button>
      </form>
      <div className="status">{status}</div>
    </div>
  );
}

export default App;