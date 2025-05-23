import ManageContacts from "@/components/modules/contact";
import { getAllContacts } from "@/services/contact";
import React from "react";

const ContactPage = async () => {
  const { data } = await getAllContacts();

  return (
    <div>
      <ManageContacts contacts={data} />
    </div>
  );
};

export default ContactPage;
