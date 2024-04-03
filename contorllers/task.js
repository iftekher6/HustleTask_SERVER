import ErrorHandler from "../middlewars/error.js";
import { Task } from "../models/task.js";


// import { Task } from "../models/task.js";
export const newTask= async (req, res, next)=>{
try {
    const {title, description}=req.body;
 if(!description || description.trim() === ''){
  return next(new ErrorHandler('Title and description cannot be empty',400))
 }
await Task.create({title, description, user: req.user,});

res.status(201).json({
    success : true,
    message : 'task added',
});
} catch (error) {
    next(error);
}

};

export const getMyTask = async (req,res,next)=>{
    
    try {
        const userid = req.user._id;

    const tasks = await Task.find({user: userid});
    res.status(200).json({
        success : true,
        tasks,
    });
    } catch (error) {
        next(error);
    }
};
const getTotalCount = async () => {
    try {
      const totalCount = await Task.aggregate([
        { $count: 'totalTodos' } // Use $count operator to get total documents
      ]);
  
      return totalCount[0].totalTodos; // Extract the count from the response
    } catch (error) {
      console.error(error);
      throw error; // Or handle the error appropriately
    }
  };
export const pagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skipIndex = (page - 1) * limit;
    
    try {
      const user = req.user._id
      const totalCount = await getTotalCount()
      const tasks = await Task.find({user})
                                 .limit(limit)
                                 .skip(skipIndex);
      res.status(200).json({tasks,totalCount});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
    
  };
export const updateTask = async (req,res,next)=>{
  
try {
   
    const task = await Task.findById(req.params.id)
    if(!task) return next(new ErrorHandler('task not found', 404));
    

    task.isCompleted = !task.isCompleted;
        
    await task.save();
    res.status(200).json({
        success : true,
        message : 'task updated',
    });
} catch (error) {
    next(error);
}
};
export const deleteTask = async (req,res,next)=>{
  try {
    const task = Task.findById(req.params.id);
    if(!task) return next(new ErrorHandler('task not found', 404));
    await task.deleteOne();
    
    
    res.status(200).json({
        success : true,
        message : 'task deleted',
    });
  } catch (error) {
    next(error);
  }
};




