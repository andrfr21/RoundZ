import { User } from "lucide-react";

interface CameraPreviewProps {
  isActive: boolean;
}

const CameraPreview = ({ isActive }: CameraPreviewProps) => {
  return (
    <div className="absolute top-4 right-4 w-64 h-44 rounded-xl overflow-hidden border-2 border-video-border bg-card shadow-2xl shadow-video-shadow backdrop-blur-sm">
      {isActive ? (
        <div className="w-full h-full bg-gradient-to-br from-secondary to-card flex items-center justify-center">
          <div className="text-center">
            <User className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Camera Preview</p>
            {/* TODO: Replace with actual video stream from getUserMedia */}
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-card flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Camera Off</p>
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
        <p className="text-xs font-medium">You</p>
      </div>
    </div>
  );
};

export default CameraPreview;
