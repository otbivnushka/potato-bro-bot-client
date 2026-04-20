// stream-test.js

async function run() {
  const res = await fetch('http://localhost:3000/messages/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3NzY1NTU5MzUsImV4cCI6MTc3NjU2MzEzNX0.qmSk0iHk63kOg3IE8cCY03q7hmOVZvGO_zOj6p1kHBA',
    },
    body: JSON.stringify({
      chatId: 1,
      content: 'Привет, расскажи что-нибудь',
    }),
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    // 👉 просто вывод сырых чанков
    console.log(chunk);
  }
}

run();
