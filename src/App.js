import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import emailjs from '@emailjs/browser';
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
    // Fetch addresses
    fetch('/addresses.json')
      .then(response => response.json())
      .then(data => setAddresses(data))
      .catch(error => console.error('Error fetching addresses:', error));

    // Fetch template
    fetch('/template.json')
      .then(response => response.json())
      .then(data => {
        setTemplateData(data);
        setFormData(prev => ({ ...prev, template: data.template }));
      })
      .catch(error => console.error('Error fetching template:', error));

    // Initialize EmailJS
    emailjs.init('YOUR_EMAILJS_PUBLIC_KEY'); // Replace with your EmailJS public key
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateChange = (content) => {
    setFormData(prev => ({ ...prev, template: content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const recipient = addresses.contacts[formData.recipientIndex];
    const emailBody = formData.template
      .replace('$salutation', recipient.salutation)
      .replace('$firstname', formData.userFirstname)
      .replace('$lastname', recipient.lastname);

    const emailParams = {
      from_name: `${formData.userFirstname} ${formData.userLastname}`,
      from_email: formData.userEmail,
      to_email: recipient.email,
      subject: `Message from ${formData.userFirstname} ${formData.userLastname}`,
      message: emailBody,
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailParams)
      .then(() => {
        setStatus('Email sent successfully!');
      })
      .catch(error => {
        console.error('Error sending email:', error);
        setStatus('Failed to send email');
      });
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