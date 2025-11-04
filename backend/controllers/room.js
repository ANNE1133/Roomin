import supabase from '../config/supabaseClient.js';

// ดูห้องทั้งหมด
export const getAllRooms = async (req, res) => {
  const { data, error } = await supabase.from('rooms').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// ดูห้องว่าง
export const getAvailableRooms = async (req, res) => {
  const { data, error } = await supabase.from('rooms').select('*').eq('status', 'available');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// ดูห้องตาม ID
export const getRoomById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Room not found' });
  res.json(data);
};

// สร้างห้องใหม่
// export const createRoom = async (req, res) => {
//     try {
//         res.send('createroom naja')
//         const { name, type, price } = req.body;
//         const { data, error } = await supabase.from('rooms').insert([{ name, type, price }]);
//         if (error) return res.status(400).json({ error: error.message });
//         res.json({ message: 'Room created', data });
//     } catch(error) {

//     }

// };
export const createRoom = async (req, res) => {
  try {
    const { name, type, price, status } = req.body;

    // validate
    if (!name || !type || !price) {
      return res.status(400).json({ message: "Name, type, and price are required" });
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert([{ name, type, price, status }])
      .select(); // select() เพื่อดึง row ที่สร้าง

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Room created', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




// แก้ไขห้อง
export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name, type, price, status } = req.body;
  const { data, error } = await supabase
    .from('rooms')
    .update({ name, type, price, status })
    .eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Room updated', data });
};

// ลบห้อง
export const deleteRoom = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('rooms').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Room deleted', data });
};
