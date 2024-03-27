function ShowFile() {
  const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  console.log(baseUrl);
    console.log(window.location.pathname);
    const url = baseUrl + "/" + window.location.pathname;
      return (
        <iframe src={url} width="100%" height="700px" frameborder="0"></iframe>
        )
    }

export default ShowFile;