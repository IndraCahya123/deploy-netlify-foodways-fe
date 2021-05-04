import { Spinner } from 'react-bootstrap';

function LoadingScreen() {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "99",
            color: "white"
        }}>
            <div>
                <Spinner
                    color= "#ffc770"
                />
                <span>Loading...</span>
            </div>
        </div>
    )
}

export default LoadingScreen;
