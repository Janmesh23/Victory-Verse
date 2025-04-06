// utils/UploadMetadataToPinata.js

/**
 * Upload a JSON object to Pinata and return its IPFS hash (CID)
 * @param {Object} metadata - The metadata JSON object to upload
 * @returns {string} CID - The IPFS hash returned by Pinata
 */
export const uploadMetadataToPinata = async (metadata) => {
    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyMTk3OWNmMy0yZDdlLTRiMmUtYTdiMy01NzAzNjFjM2U0MDQiLCJlbWFpbCI6ImNoaWxsZ3V5amFubWVzaEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMmQ3Y2UzN2M4NjFmYmY0YTBmZjUiLCJzY29wZWRLZXlTZWNyZXQiOiI2OTRiM2Q2N2E5MmEzOWFlOWZiMDhhZmUxYzU5NjhlZDk5OTIzZWM0ZmVlM2E4ZjI4ZmI4ZDBkZjlmOWM4ODNiIiwiZXhwIjoxNzc1Mzk1ODI2fQ.9egtqOkl6RvU69vP44uYA7mFERGArePA0Doanb3wdUQ`, // Replace with your JWT from Pinata
        },
        body: JSON.stringify(metadata),
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload metadata to Pinata");
      }
  
      const data = await response.json();
      return data.IpfsHash; // The CID of the pinned JSON
    } catch (error) {
      console.error("Error uploading metadata:", error);
      throw error;
    }
  };
  
  /**
   * Create metadata JSON from event details and upload it to Pinata
   * @param {string} eventName - The event's name
   * @param {string} eventDescription - The event's description
   * @param {string} imageUrl - URL of the event banner or logo
   * @returns {string} CID - The IPFS hash of the uploaded metadata
   */
  export const createAndUploadMetadata = async (eventName, eventDescription, imageUrl) => {
    // Create the metadata JSON object
    const metadata = {
      name: eventName,
      description: eventDescription,
      image: imageUrl, // This should be the URL of your uploaded file
    };
  
    // Upload metadata JSON to Pinata and return the resulting CID
    const cid = await uploadMetadataToPinata(metadata);
    return cid;
  };
  