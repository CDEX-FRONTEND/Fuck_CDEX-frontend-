import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { FC } from "react";

interface FormFieldProps {
  label?: string;
  children: any;
}

const FormField: FC<FormFieldProps>  = ({ label, children }) => {
  return (
    <Box display="flex" mb="15px">
      <Label>
        {label}
      </Label>
      <Box flex="1">
        {children}
      </Box>
    </Box>
  );
}

const Label = styled(Box)`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  color: #717779;
  padding: 0 35px 0 0;
  min-width: 86px;
`

export { FormField };
