import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Label,
  Input,
} from "reactstrap";

const EcommerceOrdersModal = props => {
  const { isOpen, toggle, staffData } = props; // Receives staffData from the parent

  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className="exampleModal"
      tabIndex="-1"
      toggle={toggle}
      size="lg"
    >
      <div className="modal-content">
        <ModalHeader toggle={toggle}>Staff Details View</ModalHeader>
        <ModalBody>
          {staffData ? (
            <Row>
              <Col className="col-12">
                <div className="mb-3">
                  <Label className="form-label">Sr No. (User ID)</Label>
                  <Input type="text" value={staffData.user_id || ""} disabled />
                </div>

                <div className="mb-3">
                  <Label className="form-label">Name</Label>
                  <Input type="text" value={staffData.name || ""} disabled />
                </div>

                <div className="mb-3">
                  <Label className="form-label">Email ID</Label>
                  <Input type="email" value={staffData.email || ""} disabled />
                </div>

                <div className="mb-3">
                  <Label className="form-label">Mobile Number</Label>
                  <Input
                    type="text"
                    value={staffData.mobile_number || ""}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <Label className="form-label">Gender</Label>
                  <Input type="text" value={staffData.gender || ""} disabled />
                </div>

                <div className="mb-3">
                  <Label className="form-label">Role</Label>
                  <Input type="text" value={staffData.role || ""} disabled />
                </div>

                <div className="mb-3">
                  <Label className="form-label">Status</Label>
                  <Input
                    type="text"
                    value={staffData.status === "yes" ? "Active" : "Inactive"}
                    className={`form-control text-${
                      staffData.status === "yes" ? "success" : "danger"
                    } fw-bold`}
                    disabled
                  />
                </div>
              </Col>
            </Row>
          ) : (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2">Fetching data from API...</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

EcommerceOrdersModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  staffData: PropTypes.object,
};

export default EcommerceOrdersModal;
