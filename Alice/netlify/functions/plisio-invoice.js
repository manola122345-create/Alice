exports.handler = async (event) => {
  try {
    const { amount, orderId, orderName, successUrl, failUrl } = JSON.parse(event.body);

    const params = new URLSearchParams({
      api_key: process.env.PLISIO_SECRET_KEY,
      source_currency: 'EUR',
      source_amount: amount.toString(),
      order_number: orderId,
      order_name: orderName,
      success_url: successUrl,
      fail_url: failUrl,
    });

    console.log('Calling Plisio with params:', params.toString().replace(process.env.PLISIO_SECRET_KEY, 'HIDDEN'));

    const res = await fetch(`https://api.plisio.net/api/v1/invoices/new?${params}`);
    const data = await res.json();

    console.log('Plisio response:', JSON.stringify(data));

    if (data.status === 'success') {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(data),
      };
    } else {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: data.data?.message || 'Plisio error', details: data }),
      };
    }
  } catch (err) {
    console.error('Function error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
