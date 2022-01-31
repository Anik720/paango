


const mongoose=require('mongoose')
const slugify=require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    totalGuests: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
   
   
 
    totalCost: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    cost: {
      type: Number,
      required: [true, 'A tour must have a price']
    },

    hotel:[  { 
      name:String,    
      location:String,
      images:[String],
      roomIds:[String],
      facilities:String,
      policies:String,
      reviews:String
    }],
    
    
 
    
    room:
      [{ name:String,
        pricePerNight:Number,
        capacity:Number,
        images:[String],
        facilities:String,
        bookingDates:Date,}]
     
    ,

    rental:[
      {
        vehicleType:String,
        vehicleModel:String,
        operatorName:String,
        seatCapacity:Number,
        pricePerDay:Number,
        reviews:[String],
        images:[String]


      }
    ],
    resorts:[
      {
        name:String,
        images:[String],
        reviews:[String],
        location:String,
        bookingDates:Date

      }
    ],
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});



tourSchema.pre('save',function(next){
  this.slug=slugify(this.name,{lowercase:true}),
  next()
})


tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Tour=mongoose.model("Tour",tourSchema)


module.exports=Tour