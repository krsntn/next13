// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  // Set headers for Server-Sent Event response
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send an initial "ping" event
  res.write(`event: ping\ndata: PING\n\n`);

  // Send a new event every second
  const intervalId = setInterval(() => {
    const data = new Date();
    res.write(
      `data: ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}\n\n`
    );
    res.flush();
  }, 2000);

  // Clean up resources when the client disconnects
  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
}
