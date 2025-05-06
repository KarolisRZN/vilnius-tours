exports.getAllTours = (req, res) => {
    res.json({ message: 'Get all tours' });
  };
  
  exports.getTourById = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Get tour with ID: ${id}` });
  };
  
  exports.createTour = (req, res) => {
    const { title, description, price } = req.body;
    res.json({ message: 'Tour created', data: { title, description, price } });
  };
  
  exports.updateTour = (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    res.json({ message: `Tour with ID ${id} updated`, updates });
  };
  
  exports.deleteTour = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Tour with ID ${id} deleted` });
  };
  