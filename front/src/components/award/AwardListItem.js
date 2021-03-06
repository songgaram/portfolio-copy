// import AwardEditForm from "./AwardEditForm";
import { useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import AwardEditForm from "./AwardEditForm";
import EditButton from "../common/EditButton";
import * as API from "../../api";

const AwardListItem = ({
  id,
  title,
  description,
  isEditable,
  getAwardList,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const HandleDelete = async() => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await API.delete(`awards/${id}`);
        getAwardList();
      } catch (err) {
        console.log("삭제 실패하였습니다.", err);
      }
    } else {
      return;
    }
  };

  return (
    <>
      {isEditing ? (
        <AwardEditForm
          setIsEditing={setIsEditing}
          itemId={id}
          itemTitle={newTitle}
          itemDescription={newDescription}
          setNewTitle={setNewTitle}
          setNewDescription={setNewDescription}
        />
      ) : (
        <Row className="align-items-center mb-3">
          <Col>
            <span>{newTitle}</span>
            <br />
            <span className="text-muted">{newDescription}</span>
          </Col>

          {isEditable && (
            <>
              <Col className="col-lg-1">
                <EditButton setIsEditing={setIsEditing} />
              </Col>
              <Col className="col-lg-1">
                <Button variant="danger" size="sm" onClick={HandleDelete}>
                  삭제
                </Button>
              </Col>
            </>
          )}
        </Row>
      )}
    </>
  );
};

export default AwardListItem;
