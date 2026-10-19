"use client";

import { useState } from "react";
import { t } from "@/config/messages.fa";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export function DialogDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => setModalOpen(true)}>
        {t("devUi.openModal")}
      </Button>
      <Button variant="outline" onClick={() => setDrawerOpen(true)}>
        {t("devUi.openDrawer")}
      </Button>
      <Button variant="outline" onClick={() => showToast(t("devUi.toastMessage"))}>
        {t("devUi.showToast")}
      </Button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t("devUi.modalTitle")}
        footer={<Button onClick={() => setModalOpen(false)}>{t("common.close")}</Button>}
      >
        <p className="text-sm text-text-muted">{t("devUi.demoBody")}</p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t("devUi.drawerTitle")}
      >
        <p className="text-sm text-text-muted">{t("devUi.demoBody")}</p>
      </Drawer>
    </div>
  );
}
