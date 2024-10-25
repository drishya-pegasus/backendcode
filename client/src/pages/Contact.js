import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported

const ContactUs = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Here you can make an API call to send the contact information
      console.log('Received values:', values);
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Your message has been sent successfully!');
    } catch (error) {
      message.error('There was an error sending your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-us">
      <h2>Contact Us</h2>
      <Form
        name="contact_us"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="message"
          label="Message"
          rules={[{ required: true, message: 'Please input your message!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Send
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ContactUs;
