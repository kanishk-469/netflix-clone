/** TMDB API address and api-key is ready  */
const c =console.log.bind(this);
const apiEndPoint= "https://api.themoviedb.org/3";
const api_key = "28adc8778e0cbb16df5062fa45617501";
const imgEndPoint = "https://image.tmdb.org/t/p/original";
const youtubeSearchApiEndPoint ="https://www.googleapis.com/youtube/v3";
const youtubeApi_Key = "AIzaSyDZYFg-Y8dOBvpBWCBbMzTiKjUY_flnlvQ";


const apiPath = {
  fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${api_key}`,  // string interpolation
  fetchMoviesList: (id) => `${apiEndPoint}/discover/movie?api_key=${api_key}&with_genres=${id}`,
  // fetchWeekTrendingMovieList: `${apiEndPoint}/trending/movie/week?api_key=${api_key}`,
  fetchTrending: `${apiEndPoint}/trending/all/day?api_key=${api_key}`,
  fetchTopRated: `${apiEndPoint}/movie/top_rated?api_key=${api_key}`,
  searchOnYoutube:(query)=> `${youtubeSearchApiEndPoint}/search?part=snippet&q=${query}&key=${youtubeApi_Key}`,
};

/** Boots up the App */
function init(){
  fetchAndBuildMovieSection(apiPath.fetchTrending,'Trending Now');
  fetchAndBuildMovieSection(apiPath.fetchTopRated,'Top Rated');
  fetchAndBuildAllSections();
  
  // fetchWeekTrendingMovieListAndBuildBanner();
}

function fetchAndBuildAllSections(){
// alert('welcome to netflix-clone');
fetch(apiPath.fetchAllCategories)
.then(res => res.json())            /** arrow function */
// .then(res => console.table(res.genres))
.then(res => 
  { 
    const catergories = res.genres;
    if(Array.isArray(catergories) && catergories.length > 0){
         catergories.forEach((catergory, idx, catergories)=>{
           fetchAndBuildMovieSection(apiPath.fetchMoviesList(catergory.id) ,catergory.name);
         });
    }
  })
.catch(err => console.error(err));
}

function fetchAndBuildMovieSection(fetchURL, catergory){
  // c(fetchURL,catergory);
  fetch(fetchURL)
  .then(response => response.json())
  .then(response => 
    {
    // c(res.results)
    const moviesArr = response.results;
    if(Array.isArray(moviesArr) && moviesArr.length > 0){
      if(catergory === "Trending Now"){
        buildBannerSectionTrendingMovie(moviesArr,catergory );
      }
       buildMoviesSection( moviesArr, catergory);
    }
  })
  .catch(err =>console.error(err))
}

function buildMoviesSection(moviesArrDetail,categoryName){
  const movieCont = window.document.getElementById('movie-cont');
//  c(moviesArrDetail,categoryName);
 const movieImages = moviesArrDetail.map((item , indx, moviesArrDetail)=>{
  // c(item.title); 
  // c(item.id);   
  // localStorage.setItem("movieId", item.id);
  return `
  <div class="movie-item" onmouseover="searchYoutubeMovieTrailer('${item.title}','yt${item.id}')">
    <img class="movie-item-img" src="${imgEndPoint}${item.backdrop_path}"  alt="${item.title}">
    <iframe width="245px" height="150px" src="" id="yt${item.id}"></iframe>
    </div>
    `;  
 }).join(''); // join karke merge kardeta hai 
  
   const div = document.createElement('div');
   div.className = "movies-section";
   div.innerHTML= `
   <h2 class="movie-section-heading"> ${categoryName}<span class="explore-nudge">Explore All</span></h2>
      <div class="movies-row">
      ${movieImages}
      </div>  
      
   `;
   // append html to movies Container
   movieCont.append(div);
}
 function buildBannerSectionTrendingMovie(moviesArray,category){
  // c(moviesArray,category);
  let randomIndex = parseInt(Math.random() * moviesArray.length);
  const bannerSection = document.getElementById('banner-section');
  bannerSection.style.backgroundImage = `url(${imgEndPoint}${moviesArray[randomIndex].backdrop_path})`;
  // c(moviesArray);

  const div = window.document.createElement('div');
  div.className= "banner-content container";
  div.innerHTML = `
   <h2 class="banner_title">${moviesArray[randomIndex].title}</h2>
      <p class="banner_info">Trending in Movie | Release - ${moviesArray[randomIndex].release_date}</p>
      <p class="banner_overview">${moviesArray[randomIndex].overview && moviesArray[randomIndex].overview.length > 200? moviesArray[randomIndex].overview.slice(0,200).trim()+"...":moviesArray[randomIndex].overview }</p>
      <div class="action-btn-cont">
        <button class="action-btn-play"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg>&nbsp;Play</button>
        <button class="action-btn-more"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg>&nbsp;More Info</button>
      </div>
    
  `;
bannerSection.append(div);
}

function searchYoutubeMovieTrailer(movieName, iframId){
  // c(document.getElementById(iframId), iframId)
  if(!movieName)return;

     fetch(apiPath.searchOnYoutube(movieName))
     .then(res => res.json())
     .then(res =>{
      const youTubeTrailerVideoId = res.items[0].id.videoId;
      /* const youtubeUrl =`https://www.youtube.com/watch?v=${youTubeTrailerVideoId}`;
       window.open(youtubeUrl,'_blank');
       c(youtubeUrl)*/
      const element = document.getElementById(iframId); // to select iframe in HTML using id i.e., iframId
      // element[0].src =`https://www.youtube.com/embed/${youTubeTrailerVideoId}?autoplay=1&control=0`; //check in HTMLCollection
      element.src =`https://www.youtube.com/embed/${youTubeTrailerVideoId}?autoplay=1&control=0`; 
     })
     .catch(error => console.error(error))

}
function buildOverlayWithMovieInfo(movieItem){
c(movieItem);
}



window.addEventListener('load', function(){
  init();
  window.addEventListener('scroll', function(){
    if(scrollY > 10){
      const header=document.getElementById('header');
      header.classList.add('black-bg');
    }else{
      header.classList.remove('black-bg');
    }
  });
});