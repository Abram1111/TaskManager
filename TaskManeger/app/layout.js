import './globals.css';

export const metadata = {
  title: 'Task Manager',
  description: 'Task Manager',
};

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
        </head>
      <body>
        {children}
      </body>
    </html>
  );
}
