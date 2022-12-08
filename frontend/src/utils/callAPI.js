export default async function callApi(endpoint, inputBody) {

  const response = await fetch(`http://localhost:5000/${endpoint}`, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputBody),
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("An error occurred in the server");
      }
    })
    .catch((error) => new Error(error));

  console.log(response)
  return response

}
