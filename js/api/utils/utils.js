const getProducts = () => {
    const data = fs.readFileSync("./api/products.json", 'utf8');
    return JSON.parse(data);
  };
  
  