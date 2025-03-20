import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import './App.css';

function App() {
  const [addresses, setAddresses] = useState({ contacts: [], salutations: [] });
  const [templateData, setTemplateData] = useState({ template: '' });
  const [branding, setBranding] = useState({
    textColor: '#333333',
    backgroundColor: '#f5f5f5',
    buttonColor: '#4CAF50',
    buttonHoverColor: '#45a049',
    logoUrl: 'https://via.placeholder.com/150x50.png?text=Your+Logo',
  });
  const [config, setConfig] = useState({ useMailto: false });
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

    // Fetch branding styles
    fetch('/style.config.json')
      .then(response => response.json())
      .then(data => setBranding(data.branding))
      .catch(error => console.error('Error fetching branding config:', error));

    // Fetch config
    fetch('/config.json')
      .then(response => response.json())
      .then(data => setConfig(data))
      .catch(error => console.error('Error fetching config:', error));
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
    setStatus('Processing...');

    const recipient = addresses.contacts[formData.recipientIndex];
    const emailBody = formData.template
      .replace('$salutation', recipient.salutation)
      .replace('$firstname', formData.userFirstname)
      .replace('$lastname', recipient.lastname);

    if (config.useMailto) {
      // Use mailto: link
      const subject = encodeURIComponent(`Message from ${formData.userFirstname} ${formData.userLastname}`);
      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:${recipient.email}?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      setStatus('Opening email client...');
    } else {
      // Use PHP SMTP
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
    }
  };

  return (
    <div className="App" style={{ backgroundColor: branding.backgroundColor, color: branding.textColor }}>
      <header>
        <img src={branding.logoUrl} alt="Logo" className="logo" />
        <h2>Email Generator</h2>
      </header>
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
          required={!config.useMailto} // Optional if using mailto
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

        <button type="submit" style={{ backgroundColor: branding.buttonColor }}>
          {config.useMailto ? 'Open Email Client' : 'Send Email'}
        </button>
      </form>
      <div className="status">{status}</div>
    </div>
  );
}

export default App;