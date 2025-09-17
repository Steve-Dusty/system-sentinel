from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime


# Add your non-auth models here as needed
# Example:
# class SystemMetric(SQLModel, table=True):
#     """System metric model for monitoring data."""
#     __tablename__ = "system_metrics"
#     
#     id: Optional[int] = Field(default=None, primary_key=True)
#     service_name: str
#     metric_type: str
#     value: float
#     timestamp: datetime = Field(default_factory=datetime.utcnow)