// Copyright (c) 2019, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

// render
frappe.listview_settings["Leave Allocation"] = {
	get_indicator: function (doc) {
		if (doc.status === "Expired") {
			return [__("Expired"), "gray", "expired, =, 1"];
		}
	},
	onload: function (listview) {
		listview.page.add_action_item(
			__("Allocate More Leaves"),
			() => {
				const allocations = listview
					.get_checked_items()
					.map((allocation) => allocation.name);
				const dialog = new frappe.ui.Dialog({
					title: "Manual Leave Allocation",
					fields: [
						{
							label: "New Leaves to be Allocated",
							fieldname: "new_leaves",
							fieldtype: "Float",
						},
					],
					primary_action_label: "Allocate",
					primary_action({ new_leaves }) {
						frappe.call({
							method: "hrms.hr.doctype.leave_allocation.leave_allocation.bulk_allocate_leaves",
							args: { allocations, new_leaves },
							freeze: true,
							freeze_message: __("Allocating Leaves"),
						});
						dialog.hide();
					},
				});
				dialog.show();
			},
			__("Actions"),
		);
	},
	refresh: function (listview) {
		hrms.handle_realtime_bulk_action_notification(
			listview,
			"completed_bulk_leave_allocation",
			"Leave Allocation",
		);
	},
};
