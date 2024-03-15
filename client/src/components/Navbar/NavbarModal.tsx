import { Link } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavbarModal({ isOpen, onClose }: ModalProps) {
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-gray-900 opacity-50"
            onClick={handleCloseModal}
          ></div>
          <div className="fixed inset-y-0 right-0 w-1/2 bg-white z-50 shadow-lg">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Menu</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-blue-500 hover:underline"
                    onClick={handleCloseModal}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-blue-500 hover:underline"
                    onClick={handleCloseModal}
                  >
                    Quick Notes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/completed"
                    className="text-blue-500 hover:underline"
                    onClick={handleCloseModal}
                  >
                    Completed
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavbarModal;
