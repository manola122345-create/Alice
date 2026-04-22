exports.handler = async (event) => {
  try {
    const { amount, orderId, orderName, successUrl, failUrl } = JSON.parse(event.body);

    const params = new URLSearchParams({
      api_key: process.env.PLISIO_SECRET_KEY,
      currency: 'USDT',
      amount: amount.toString(),
      order_number: orderId,
      order_name: orderName,
      success_url: successUrl,
      fail_url: failUrl,
    });

    const res = await fetch(`https://plisio.net/api/v1/invoices/new?${params}`);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
