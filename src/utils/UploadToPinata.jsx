export const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
        name: "event-banner",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
        cidVersion: 1,
    });
    formData.append("pinataOptions", options);

    try {
        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyMTk3OWNmMy0yZDdlLTRiMmUtYTdiMy01NzAzNjFjM2U0MDQiLCJlbWFpbCI6ImNoaWxsZ3V5amFubWVzaEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMmQ3Y2UzN2M4NjFmYmY0YTBmZjUiLCJzY29wZWRLZXlTZWNyZXQiOiI2OTRiM2Q2N2E5MmEzOWFlOWZiMDhhZmUxYzU5NjhlZDk5OTIzZWM0ZmVlM2E4ZjI4ZmI4ZDBkZjlmOWM4ODNiIiwiZXhwIjoxNzc1Mzk1ODI2fQ.9egtqOkl6RvU69vP44uYA7mFERGArePA0Doanb3wdUQ`, // Replace with your JWT from Pinata
            },
            body: formData,
        });

        const data = await res.json();
        return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (error) {
        console.error("Pinata upload failed:", error);
        return null;
    }
};
