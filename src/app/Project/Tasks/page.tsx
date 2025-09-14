import "../../../styles/frappe-gantt.css";
import PhaseList from "../../../components/phase-list";
import {
  GanttComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Selection,
  DayMarkers,
  Edit,
  Filter,
  Toolbar,
  CriticalPath,
} from "@syncfusion/ej2-react-gantt";
import { GanttData, taskFields } from "../../../testdata/testdata";

function TasksView() {
  const editOptions = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
  };

  const toolbarOptions = [
    "Add",
    "Edit",
    "Delete",
    "Cancel",
    "Update",
    "PrevTimeSpan",
    "NextTimeSpan",
    "ExpandAll",
    "CollapseAll",
    "Search",
    "Indent",
    "Outdent",
  ];

  return (
    <div className="w-full h-[700px] max-h-[500px] min-w-[500px] border-gray-300">
      <GanttComponent
        dataSource={GanttData}
        taskFields={taskFields}
        height="800px"
        width="1820px"
        allowSelection={true}
        editSettings={editOptions}
        toolbar={toolbarOptions}
        enableCriticalPath={true}
      >
        <Inject
          services={[
            Edit,
            CriticalPath,
            Selection,
            DayMarkers,
            Toolbar,
            Filter,
          ]}
        />
      </GanttComponent>
    </div>
  );
}

export default TasksView;
