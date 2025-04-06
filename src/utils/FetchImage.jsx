const fetchImageFromMetadata = async (metadataURI) => {
        try {
            // Convert to a gateway URL to make it fetchable in the browser
            const gatewayUrl = convertToGatewayUrl(metadataURI);
            const response = await fetch(gatewayUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const metadata = await response.json();
            return metadata.image; // Return the image URL from the metadata
        } catch (error) {
            console.error("Error fetching metadata:", error);
            return null;
        }
    };
