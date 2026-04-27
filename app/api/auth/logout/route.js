export async function GET(request) {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'userId=; Path=/; Max-Age=0'
    }
  });
}