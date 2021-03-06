import React from "react";
import "./../App.css";
import Ratings from "react-ratings-declarative";
import ShowMore from "react-show-more";
import Moment from "react-moment";
import "moment-timezone";
import { Spring } from "react-spring/renderprops";

const API_KEY = "1c00c1b12b0e6338ebfa2508463a527b";

const GENRES =
  "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
  API_KEY +
  "&language=en-US";

const MOVIE_LINK = "https://www.themoviedb.org/movie/";

let startDate = "";
let endDate = "";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      apiKey: API_KEY,
      movies: [],
      genres: [],
      selectedGenre: "",
      pageNum: 1,
      totalPage: "",
      startDate: new Date(),
      endDate: new Date()
    };
    this.getMovies = this.getMovies.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  // Called when constructor is finished building component.
  componentDidMount() {
    let selectedGenre;
    selectedGenre = this.state.selectedGenre;

    let pageNum;
    pageNum = this.state.pageNum;

    this.setState({ pageNum: pageNum });
    // this.setState({ selectedGenre: selectedGenre });
    this.getMovies(selectedGenre, pageNum);
    this.getGenres();
  }

  handleGenreChange(e) {
    this.setState({ selectedGenre: e.target.value, pageNum: 1 });
    this.getMovies(e.target.value, this.state.pageNum);
  }

  previousPage() {
    if (this.state.pageNum > 1) {
      this.getMovies(this.state.selectedGenre, this.state.pageNum - 1);
      this.setState({ pageNum: this.state.pageNum - 1 });
    }
  }
  nextPage() {
    if (this.state.pageNum < this.state.totalPage) {
      this.getMovies(this.state.selectedGenre, this.state.pageNum + 1);
      this.setState({ pageNum: this.state.pageNum + 1 });
    }
  }

  checkDates() {
    var d = new Date();
    var the_end_month = ("0" + (d.getMonth() + 1)).slice(-2);
    var the_end_date = ("0" + d.getDate()).slice(-2);

    endDate = d.getFullYear() + "-" + the_end_month + "-" + the_end_date;

    d.setDate(d.getDate() - 60);
    var the_start_month = ("0" + (d.getMonth() + 1)).slice(-2);
    var the_start_date = ("0" + d.getDate()).slice(-2);

    startDate = d.getFullYear() + "-" + the_start_month + "-" + the_start_date;
  }

  getMovies(selectedGenre, pageNum) {
    this.checkDates();
    const URL =
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
      API_KEY +
      "&page=" +
      pageNum +
      "&with_genres=" +
      selectedGenre +
      "&primary_release_date.gte=" +
      startDate +
      "&primary_release_date.lte=" +
      endDate;
    // console.log(URL);

    // Request and wait for data from remote server.
    fetch(URL)
      .then(response => response.json())
      // Data retrieved so parse it.
      .then(data => {
        this.setState({ movies: data.results });
        // console.log(JSON.stringify(data.results));
        // console.log(JSON.stringify(data));
        this.setState({ totalPage: data.total_pages });
        // console.log("Total pages= " + data.total_pages);
      })
      // Data is not retieved.
      .catch(error => {
        alert(error);
      });
  }

  getGenres() {
    // This code gets data from the remote server.
    fetch(GENRES)
      .then(response => response.json())

      // Data is retrieved.
      .then(data => {
        this.setState({ genres: data.genres });
        // console.log(JSON.stringify(data.genres));
      })
      // Data is not retrieved.
      .catch(error => {
        alert(error);
      });
  }

  render() {
    return (
      <div>
        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          config={{ delay: 1000, duration: 1000 }}
        >
          {props => (
            <div style={props}>
              <div className="home-body">
                <p className="date-result">
                  Date Range |{" "}
                  <Moment format="YYYY MMM DD" withTitle>
                    {startDate}
                  </Moment>{" "}
                  to{" "}
                  <Moment format="YYYY MMM DD" withTitle>
                    {endDate}
                  </Moment>
                </p>
                {/* Genres */}
                <select
                  type="text"
                  value={this.state.selectedGenre}
                  onChange={this.handleGenreChange}
                >
                  <option value="" defaultValue="" disabled hidden>
                    Choose Genre
                  </option>
                  {this.state.genres.map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                  }
                </select>
                {/* Page Button */}
                <div className="page-number">
                  <button onClick={this.previousPage}>&#10094;</button>
                  &nbsp;{this.state.pageNum} / {this.state.totalPage}&nbsp;
                  <button onClick={this.nextPage}>&#10095;</button>
                </div>
                {/* Movie Info */}
                <div className="container">
                  <div className="grid-items">
                    {this.state.movies.map((item, index) => (
                      <div className="grid-item" key={item.id}>
                        <a
                          href={MOVIE_LINK + item.id}
                          alt={item.title}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={
                              "https://image.tmdb.org/t/p/w185" +
                              item.poster_path
                            }
                            alt={"poster of " + item.title}
                            // TODO Show alternative img on error
                            onError={e => {
                              console.log("img cannot be found");
                              e.target.onError = null;
                              e.target.src = "/movie/error.png";
                            }}
                          />
                        </a>
                        <h2>{item.title}</h2>
                        <div className="starts-rating">
                          <span>
                            <Ratings
                              rating={item.vote_average / 2}
                              widgetDimensions="1.2em"
                              widgetSpacings="1px"
                            >
                              <Ratings.Widget
                                widgetRatedColor="#fff967"
                                widgetEmptyColor="#9A9191"
                              />
                              <Ratings.Widget
                                widgetRatedColor="#fff967"
                                widgetEmptyColor="#9A9191"
                              />
                              <Ratings.Widget
                                widgetRatedColor="#fff967"
                                widgetEmptyColor="#9A9191"
                              />
                              <Ratings.Widget
                                widgetRatedColor="#fff967"
                                widgetEmptyColor="#9A9191"
                              />
                              <Ratings.Widget
                                widgetRatedColor="#fff967"
                                widgetEmptyColor="#9A9191"
                              />
                            </Ratings>
                          </span>
                          <span>
                            {item.vote_average === 0
                              ? "N/A"
                              : item.vote_average}
                          </span>
                        </div>
                        <div className="realse-date">
                          In Theaters -{" "}
                          <Moment format="MMM DD" withTitle>
                            {item.release_date}
                          </Moment>
                        </div>
                        <div className="container-overview">
                          <div className="overview">
                            <ShowMore
                              lines={8}
                              more="Click & scroll"
                              less="Show less"
                              anchorClass="show-text"
                            >
                              {item.overview === ""
                                ? "The film information is not available."
                                : item.overview}
                            </ShowMore>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Spring>
      </div>
    );
  }
}
export default Home;
