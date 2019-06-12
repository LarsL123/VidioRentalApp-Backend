const { Rental } = require("../../../models/rental");
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../../models/user");
const moment = require("moment");
const { Movie } = require("../../../models/movie");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let token;
  let rental;
  let movie;

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ movieId, customerId });
  };

  beforeEach(async () => {
    server = require("../../../index");
    token = new User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10
    });
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345"
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2
      }
    });

    await movie.save();
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental was found for this customer/movie", async () => {
    await Rental.deleteMany();

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if return already processed", async () => {
    rental.dateReturned = new Date();

    await rental.save();
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if the return was successfull", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should set the returndDate if input is valid", async () => {
    await exec();
    const rentalInDB = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDB.dateReturned;
    expect(diff).toBeLessThan(10 * 1000); //10 sec
  });

  it("calculate the rentalFee if input is valid", async () => {
    rental.dateOut = moment()
      .add(-7, "days")
      .toDate();
    await rental.save();

    await exec();

    const rentalInDB = await Rental.findById(rental._id);
    expect(rentalInDB.rentalFee).toBe(14);
  });

  it("increase the stock by one", async () => {
    await exec();
    const movieInDB = await Movie.findById(movieId);

    expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("Return the rental ", async () => {
    const res = await exec();
    const rentalInDB = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie"
      ])
    );
  });
});
