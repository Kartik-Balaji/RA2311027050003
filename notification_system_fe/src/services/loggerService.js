const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYjA4NjNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNzYxNiwiaWF0IjoxNzc3NzA2NzE2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZWMzNzhhMjgtNzRlZC00NmFkLWIyMTMtODAxZWYxNzkxYWQ2IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia2FydGlrIGJhbGFqaSIsInN1YiI6IjRlN2FlNzUyLWJhMjItNDM1MC1hZWFhLTNjYjY3MjViMDQ1MiJ9LCJlbWFpbCI6ImtiMDg2M0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6ImthcnRpayBiYWxhamkiLCJyb2xsTm8iOiJyYTIzMTEwMjcwNTAwMDMiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI0ZTdhZTc1Mi1iYTIyLTQzNTAtYWVhYS0zY2I2NzI1YjA0NTIiLCJjbGllbnRTZWNyZXQiOiJ0dFpnaEhLSmZCa3ladWJOIn0.zfoXbuJdbhouDbhnclKUPIO9XOrUYyR5Bi_WW7rTb6A";

export async function logEvent({
  stack = "frontend",
  level = "info",
  packageName = "api",
  message,
}) {
  console.log("Logger called:", { stack, level, package: packageName, message });
  const url = new URL("/logs", window.location.origin);
  
  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BEARER_TOKEN}`,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });
    
    console.log("Logger response:", response.status);
  } catch (err) {
    console.log("Logger catch error:", err.message);
  }
}

export { BEARER_TOKEN };