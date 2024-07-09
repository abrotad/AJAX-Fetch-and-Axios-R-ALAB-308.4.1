import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.thecatapi.com/v1",
  headers: {
    "x-api-key":
      "live_doefnFzRPFiKnjbJQzljjanV2sv7bUhmoXL0J31YnIRQPYla6Vg8dICOSR3kDhua",
  },
});

const progressBar = document.getElementById("progressBar");
progressBar.style.width = "0%"; // Reset progress bar width

const updateProgress = (event) => {
  if (event.lengthComputable) {
    const progress = (event.loaded / event.total) * 100;
    progressBar.style.width = progress + "%";
    console.log(event);
  }
};

// Request interceptor to log the start time of the request and update progress bar
instance.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    progressBar.style.width = "0%";
    config.onDownloadProgress = updateProgress;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to log the time between request and response
instance.interceptors.response.use(
  (response) => {
    const elapsedTime = new Date() - response.config.metadata.startTime;
    console.log("Request completed in " + elapsedTime + "ms");
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const fetchBreeds = async () => {
  try {
    const response = await instance.get("/breeds");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchBreedInfo = async (breedId) => {
  try {
    const response = await instance.get(`/images/search?breed_ids=${breedId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export { fetchBreeds, fetchBreedInfo };
export default instance;
